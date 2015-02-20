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

package it.smartcommunitylab.cityreport.test.service;

import it.smartcommunitylab.cityreport.data.ServiceRepository;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.services.ServiceManager;
import it.smartcommunitylab.cityreport.test.TestConfig;

import org.junit.After;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author raman
 *
 */
@Ignore
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class TestServiceManager {

	@Autowired
	private ServiceRepository serviceRepository;
	@Autowired
	private ServiceManager manager;
	@After
	public void init() {
		serviceRepository.deleteAll();
	}
	
	@Test
	public void testLoadedServices() {
		Service service = manager.findService("problems", "ComuneRovereto");
		Assert.assertNotNull(service);
	}

}
