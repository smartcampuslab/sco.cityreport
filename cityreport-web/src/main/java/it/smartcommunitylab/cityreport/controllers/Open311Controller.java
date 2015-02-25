/*******************************************************************************
 * Copyright 2015 Smart Community Lab
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/

package it.smartcommunitylab.cityreport.controllers;

import it.smartcommunitylab.cityreport.controllers.exception.Open311Exception;
import it.smartcommunitylab.cityreport.model.Issuer;
import it.smartcommunitylab.cityreport.model.Location;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.model.ServiceIssue;
import it.smartcommunitylab.cityreport.services.IssueManager;
import it.smartcommunitylab.cityreport.services.ServiceManager;
import it.smartcommunitylab.cityreport.utils.Open311Converter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.joda.time.LocalDate;
import org.open311.wiki.georeport_v2.Errors;
import org.open311.wiki.georeport_v2.Request;
import org.open311.wiki.georeport_v2.ServiceDefinition;
import org.open311.wiki.georeport_v2.ServiceRequests;
import org.open311.wiki.georeport_v2.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author raman
 *
 */
@RequestMapping("/open311")
@Controller
public class Open311Controller {

	@Autowired
	private ServiceManager manager;
	@Autowired
	private IssueManager issueManager;


	@RequestMapping(method=RequestMethod.GET, value="/services")
	public @ResponseBody Services getServices(@RequestParam(required=false) String jurisdiction_id) {
		if (jurisdiction_id == null) throw new Open311Exception(400, "jurisdiction_id must be provided");
		return Open311Converter.toOpen311ServiceList(manager.findServices(jurisdiction_id));
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/services/{service_code}")
	public @ResponseBody ServiceDefinition getServiceDef(@RequestParam(required=false) String jurisdiction_id, @PathVariable String service_code) {
		if (jurisdiction_id == null) throw new Open311Exception(400, "jurisdiction_id must be provided");
		Service service = manager.findService(service_code, jurisdiction_id);
		if (service == null) throw new Open311Exception(404, "service_code/jurisdiction_id was not found");
		return Open311Converter.toOpen311ServiceDefinition(service);
	}

	@RequestMapping(method=RequestMethod.GET, value="/requests")
	public @ResponseBody ServiceRequests getRequests(
			@RequestParam(required=false) String jurisdiction_id, 
			@RequestParam(required=false) String service_request_id,
			@RequestParam(required=false) String service_code,
			@RequestParam(required=false) String start_date,
			@RequestParam(required=false) String end_date,
			@RequestParam(required=false) String status) throws Exception {
		if (jurisdiction_id == null) throw new Open311Exception(400, "jurisdiction_id must be provided");

		if (service_request_id != null) {
			Set<String> ids = StringUtils.commaDelimitedListToSet(service_request_id);
			List<Request> issues = new ArrayList<Request>();
			for (String id : ids) {
				ServiceIssue issue = issueManager.findProviderIssue(id, jurisdiction_id);
				Service service = manager.findService(issue.getServiceId(), issue.getProviderId());
				issues.add(Open311Converter.toOpen311RequestObject(issue, service));
			}
			return new ServiceRequests(issues);
		}
		Long start = 
				  start_date != null 
				? Open311Converter.Open311DateTimeToTimestamp(start_date) 
				: new LocalDate().minusDays(90).toDate().getTime();
		Long end = 
				  end_date != null 
				? Open311Converter.Open311DateTimeToTimestamp(end_date) 
				: System.currentTimeMillis();
		List<ServiceIssue> issues = issueManager.findIssues(
				jurisdiction_id, 
				service_code != null ? StringUtils.commaDelimitedListToSet(service_code) : null, 
				status, 
				start, 
				end, 
				null, 
				null, 
				null, 
				null, 
				null);
		
		List<Request> requests = new ArrayList<Request>();
		for (ServiceIssue issue : issues) {
			Service service = manager.findService(issue.getServiceId(), issue.getProviderId());
			requests.add(Open311Converter.toOpen311RequestObject(issue, service));
		}
		return new ServiceRequests(requests);
	}

	@RequestMapping(method=RequestMethod.POST, value = "/requests")
	public @ResponseBody ServiceRequests reportUserIssue(
			@RequestParam(required=false) String jurisdiction_id, 
			@RequestParam String service_code,
			@RequestParam String api_key,
			@RequestParam(required=false) Double lat,
			@RequestParam(required=false, value="long") Double lng,
			@RequestParam(required=false) String address_string,
			@RequestParam(required=false) String address_id,
			@RequestParam(required=false) String email,
			@RequestParam(required=false) String device_id,
			@RequestParam(required=false) String account_id,
			@RequestParam(required=false) String first_name,
			@RequestParam(required=false) String last_name,
			@RequestParam(required=false) String phone,
			@RequestParam(required=false) String description,
			@RequestParam(required=false) String media_url,
			HttpServletRequest req) {

		Service service = manager.findService(service_code, jurisdiction_id);
		if (jurisdiction_id == null) throw new Open311Exception(400, "jurisdiction_id must be provided");
		if (service == null) throw new Open311Exception(404, "service_code/jurisdiction_id was not found");
		if (api_key == null) throw new Open311Exception(403, "api_key must be provided");

		// TODO check api_key
		
		ServiceIssue issue = new ServiceIssue();
		issue.setProviderId(jurisdiction_id);
		issue.setServiceId(service_code);
		issue.setLocation(new Location());
		issue.setIssuer(new Issuer());
		issue.setMedia(new ArrayList<String>());
		
		if (lat != null && lng != null) issue.getLocation().setCoordinates(new double[]{lat,lng}); 
		if (address_string != null) issue.getLocation().setAddress(address_string);
		if (address_id != null) issue.getLocation().setAddress(address_id);
		if (email != null) issue.getIssuer().setEmail(email);
		if (account_id != null) issue.getIssuer().setUserId(account_id);
		if (first_name != null) issue.getIssuer().setName(first_name);
		if (last_name != null) issue.getIssuer().setSurname(last_name);
		if (phone != null) issue.getIssuer().setPhone(phone);
		if (description != null) issue.setNotes(description);
		if (media_url != null) issue.getMedia().add(media_url);
		Map<String,Object> attrs = new HashMap<String, Object>();
		Pattern p = Pattern.compile("attribute\\[((.)*)\\]");
		for (String param : req.getParameterMap().keySet()) {
			Matcher m = p.matcher(param);
			if (!m.find()) continue;
			String attr = m.group(1);
			if (StringUtils.hasText(attr)) {
				String[] value = req.getParameterValues(param);
				attrs.put(attr, StringUtils.arrayToCommaDelimitedString(value));
			}
		}
		if (!attrs.isEmpty()) {
			issue.setAttribute(attrs);
		}
		ServiceIssue result = issueManager.createIssue(issue);
		return Open311Converter.toOpen311RequestCreation(result.getId(), service.getAckMessage(), account_id);
	}

	
	@ExceptionHandler(Exception.class)
	public @ResponseBody Errors handleExceptions(Exception exception) {
		if (exception instanceof Open311Exception) {
			return Open311Converter.toOpen311Errors(((Open311Exception) exception).getCode(), ((Open311Exception) exception).getDescr());
		}
		return Open311Converter.toOpen311Errors(400, "general error");
	}
	
}
