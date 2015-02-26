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

package it.smartcommunitylab.cityreport.security;

import it.smartcommunitylab.cityreport.model.Issuer;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;

import eu.trentorise.smartcampus.profileservice.BasicProfileService;
import eu.trentorise.smartcampus.profileservice.ProfileServiceException;
import eu.trentorise.smartcampus.profileservice.model.BasicProfile;

/**
 * @author raman
 *
 */
public class SCOUserAuthenticator implements UserAuthenticator {

	private BasicProfileService service = null;

	
	public SCOUserAuthenticator(String aacURL) {
		service = new BasicProfileService(aacURL);
	}


	@Override
	public Issuer identifyUser(HttpServletRequest req) throws SecurityException {
		String header = req.getHeader("Authorization"); 
		if (header == null || !header.trim().toLowerCase().startsWith("bearer ")) {
			throw new SecurityException("Missing or incorrect authorization header");
		}
		header = header.substring(header.indexOf(' ')+1);

		Issuer issuer = new Issuer();
		try {
			BasicProfile profile = service.getBasicProfile(header);
			issuer.setUserId(profile.getUserId());
			issuer.setName(profile.getName());
			issuer.setSurname(profile.getSurname());
		} catch (Exception e) {
			throw new SecurityException(e.getMessage() == null ? "Access denied" : e.getMessage());
		}
		return issuer;
	}

}
