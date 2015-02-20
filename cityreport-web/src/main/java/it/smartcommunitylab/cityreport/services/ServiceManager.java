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

package it.smartcommunitylab.cityreport.services;

import java.util.List;

import javax.annotation.PostConstruct;

import it.smartcommunitylab.cityreport.data.ServiceRepository;
import it.smartcommunitylab.cityreport.model.ProviderSettings;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.security.ProviderSetup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author raman
 *
 */
@Component
public class ServiceManager {
	
	private final static Logger logger = LoggerFactory.getLogger(ServiceManager.class);
	
	@Autowired
	private ServiceRepository repository;
	@Autowired
	private ProviderSetup providerSetup;
	
	@PostConstruct 
	private void init() {
		for (ProviderSettings ps : providerSetup.getProviders()) {
			if (ps.getServices() != null)
				for (Service s : ps.getServices()) {
					Service existing = repository.findByProviderIdAndServiceId(ps.getId(), s.getServiceId());
					if (existing == null) {
						s.setProviderId(ps.getId());
						saveService(s);
					}
				}
		}
	}
	
	public Service saveService(Service service) {
		logger.debug("creating service {}",service.getName());
		return repository.save(service);
	}
	
	public Service findService(String serviceId, String providerId) {
		logger.debug("searching service {}/{}",providerId, serviceId);
		Service service = repository.findByProviderIdAndServiceId(providerId, serviceId);
		logger.debug("searching service {}/{}: found {}",providerId, serviceId, service);
		return service;
	}
	public Service findServiceByName(String name, String providerId) {
		logger.debug("searching service by name {}/{}",providerId, name);
		Service service = repository.findByProviderIdAndName(providerId, name);
		logger.debug("searching service by name {}/{}: found {}",providerId, name, service);
		return service;
	}
	public List<Service> findServices(String providerId) {
		logger.debug("searching services for provider {}",providerId);
		List<Service> result = repository.findByProviderId(providerId);
		logger.debug("searching services for provider {}: found {}",providerId, result != null ? result.size() : 0);
		return result;
	}
}
