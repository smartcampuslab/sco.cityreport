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

package it.smartcommunitylab.cityreport.services;

import it.smartcommunitylab.cityreport.data.IssuerRepository;
import it.smartcommunitylab.cityreport.model.Issuer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author raman
 *
 */
@Component
public class IssuerManager {

	@Autowired
	private IssuerRepository issuerRepository;
	
	public void saveIssuer(Issuer issuer) {
		issuerRepository.save(issuer);
	}
	
	public Issuer getIssuer(String userId) {
		return issuerRepository.findByUserId(userId);
	}
}
