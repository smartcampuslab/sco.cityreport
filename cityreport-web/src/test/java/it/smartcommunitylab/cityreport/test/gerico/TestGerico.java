/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
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
package it.smartcommunitylab.cityreport.test.gerico;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.bson.types.ObjectId;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.util.StringUtils;

import eu.trentorise.smartcampus.network.RemoteConnector;
import eu.trentorise.smartcampus.network.RemoteException;

/**
 * @author raman
 *
 */
public class TestGerico {

	@Test
	public void testCreation() throws JsonGenerationException, JsonMappingException, IOException, NoSuchAlgorithmException {
		Map<String, Object> data = new HashMap<String,Object>();
		String id = new ObjectId().toString();
		data.put("external_id_new", id);
		data.put("attivatore", "app_s");
		data.put("mezzo", "app_s");
		data.put("origine", "cit");
		data.put("origine_dettaglio", "test test test");
		data.put("email", "test@test.com");
		data.put("note", "una prova");
		data.put("oggetto", "prova");
		data.put("stato", "A");
		data.put("strada", "via verdi");
		data.put("latitudine", "11.1111111");
		data.put("longitudine", "45.5555555");
		data.put("mac", generateMac("286b5d03a4b2fa092f091c2b982cb028090e2936",id));
		String body = new ObjectMapper().writeValueAsString(data);
		body = URLEncoder.encode(body, "utf-8");
		try {
			String json = RemoteConnector.getJSON("https://www2.comune.rovereto.tn.it/", "gerico/ws_crea_richiesta/"+body, null);
			System.err.println(json);
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (RemoteException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * @param string
	 * @param id
	 * @return
	 * @throws UnsupportedEncodingException 
	 * @throws NoSuchAlgorithmException 
	 */
	private static Object generateMac(String key, String id) throws UnsupportedEncodingException, NoSuchAlgorithmException {
		return DigestUtils.shaHex((id+key).getBytes("utf8"));
	}
	public static void main(String[] args) {
	}
}
