package it.smartcommunitylab.cityreport.utils;

import it.smartcommunitylab.cityreport.data.IssueRepository;
import it.smartcommunitylab.cityreport.model.ServiceIssue;
import it.smartcommunitylab.cityreport.services.IssueManager;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import eu.trentorise.smartcampus.network.RemoteConnector;

@Component
public class GericoConnector {
	
	@Autowired
	private IssueRepository issueRepository;	
	
	@Autowired
	private IssueManager manager;
	
	private final static Logger logger = LoggerFactory.getLogger(GericoConnector.class);

	@Scheduled(initialDelay=30000, fixedRate=7200000)
	public void getIssues() throws JsonParseException, JsonMappingException, MalformedURLException, IOException {
		logger.info("Scheduled Gerico");
		
		ObjectMapper mapper = new ObjectMapper();
		
		Map<String, Object> map = mapper.readValue(new URL("https://www2.comune.rovereto.tn.it/gerico/extra/opendata_richieste/"), Map.class);
		List<Map<String, Object>> data = (List<Map<String, Object>>)map.get("data");
		
		for (Map<String, Object> entry: data) {
			String attivatore = (String)entry.get("attivatore");
			if ("App segnala".equals(attivatore) || "app_s".equals(attivatore)) {
				processEntry(entry);
			}
		}
	}	
	
	
	public void getIssues(String year, String fromMonth, String toMonth) throws JsonParseException, JsonMappingException, MalformedURLException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		
		Map<String, Object> map = mapper.readValue(new URL("https://www2.comune.rovereto.tn.it/gerico/extra/opendata_richieste/0/" + year + "/" + fromMonth + "/" + toMonth), Map.class);
		List<Map<String, Object>> data = (List<Map<String, Object>>)map.get("data");
		
		for (Map<String, Object> entry: data) {
			String attivatore = (String)entry.get("attivatore");
			if ("App segnala".equals(attivatore) || "app_s".equals(attivatore)) {
				processEntry(entry);
			}
		}
	}
	
	private void processEntry(Map<String, Object> entry) {
		String externalId = (String)entry.get("external_id");
		ServiceIssue issue = issueRepository.findByExternalId(externalId);

//		System.out.println(entry);
//		System.out.println("_____________________________");		
		
		if (issue != null) {
			logger.info("Updating " + issue.getExternalId());
			String status = (String)entry.get("stato");
			if ("A".equals(status)) {
				status = Constants.STATUS_OPEN;
			} else if ("C".equals(status)) {
				status = Constants.STATUS_CLOSED;
			}  
			issue.setStatus(status);
			issueRepository.save(issue);
		}
	}
	
	
	public boolean sendIssue(ServiceIssue issue) {
		boolean ok = true;

		try {

			Map<String, Object> data = new HashMap<String, Object>();

			String id = "" + manager.getCounter();
			// String id = "" + issue.getId().hashCode();

			data.put("external_id", id);
			data.put("attivatore", "app_s");
			data.put("mezzo", "app_s");
			data.put("origine", "cit");
			data.put("operatore_inserimento", "loris");
			data.put("attivatore_dettaglio", "loris");

			String oggetto = "";
			if (issue.getAttribute() != null && issue.getAttribute().containsKey("title")) {
				oggetto = (String) issue.getAttribute().get("title");
			}

			data.put("oggetto", oggetto);

			String note = "";
			if (issue.getAttribute() != null && issue.getAttribute().containsKey("description")) {
				note += (String) issue.getAttribute().get("description") + "\n";
			}
			if (issue.getMedia() != null) {
				for (String media : issue.getMedia()) {
					note += media + "\n";
				}
			}
			note = URLEncoder.encode(note, "utf-8");
			data.put("note", note);

			if (issue.getLocation() != null) {
				if (issue.getLocation().getAddress() != null) {
					data.put("strada", issue.getLocation().getAddress());
				}
				if (issue.getLocation().getCoordinates() != null) {
					data.put("latitudine", "" + issue.getLocation().getCoordinates()[0]);
					data.put("longitudine", "" + issue.getLocation().getCoordinates()[1]);
				}
				//
			}

			data.put("mac", generateMac("286b5d03a4b2fa092f091c2b982cb028090e2936", id));
			String body = new ObjectMapper().writeValueAsString(data);
			body = URLEncoder.encode(body, "utf-8");

			String result = RemoteConnector.getJSON("https://www2.comune.rovereto.tn.it/", "gerico/ws_crea_richiesta/" + body, null);
			try {
				Integer code = Integer.parseInt(result.trim().replace("\n", ""));
				issue.setExternalId(id);
				issueRepository.save(issue);
			} catch (Exception e) {
				logger.error("ws_crea_richiesta returned: " + result);
				e.printStackTrace();
				ok = false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			ok = false;
		}

		return ok;
	}
	
	
	
	private Object generateMac(String key, String id) throws UnsupportedEncodingException, NoSuchAlgorithmException {
		return DigestUtils.shaHex((id+key).getBytes("utf8"));
	}
	
	
}
