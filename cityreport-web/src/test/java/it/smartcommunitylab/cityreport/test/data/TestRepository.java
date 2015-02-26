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

package it.smartcommunitylab.cityreport.test.data;

import it.smartcommunitylab.cityreport.data.IssueRepository;
import it.smartcommunitylab.cityreport.data.ServiceRepository;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.model.ServiceIssue;
import it.smartcommunitylab.cityreport.test.ObjectHelper;
import it.smartcommunitylab.cityreport.test.TestConfig;

import java.text.ParseException;
import java.util.Collections;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Circle;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author raman
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class TestRepository {

	@Autowired
	private ServiceRepository serviceRepository;
	@Autowired
	private IssueRepository issueRepository;
	
	@Before
	public void init() {
		serviceRepository.deleteAll();
		issueRepository.deleteAll();
	}
	
	@Test
	public void testServiceRepo() {
		Service service = ObjectHelper.createService();
		serviceRepository.save(service);
		
		Service saved = serviceRepository.findByProviderIdAndServiceId(service.getProviderId(), service.getServiceId());
		Assert.assertNotNull(saved);
		Assert.assertEquals(service, saved);
		
		saved = serviceRepository.findByProviderIdAndName(service.getProviderId(), service.getName());
		Assert.assertNotNull(saved);
		Assert.assertEquals(service, saved);
		
		serviceRepository.save(saved);
		saved = serviceRepository.findByProviderIdAndServiceId(service.getProviderId(), service.getServiceId());
		Assert.assertNotNull(saved);
		Assert.assertEquals(service, saved);
		
		serviceRepository.delete(saved);
		saved = serviceRepository.findByProviderIdAndServiceId(service.getProviderId(), service.getServiceId());
		Assert.assertNull(saved);
	}
	
	@Test
	public void testIssueRepo() throws ParseException {
		ServiceIssue issue = ObjectHelper.createIssue();
		
		ServiceIssue saved = issueRepository.save(issue);
		Assert.assertNotNull(saved);
		Assert.assertEquals(issue, saved);
		
		saved = issueRepository.findByProviderIdAndExternalId(issue.getProviderId(), issue.getExternalId());
		Assert.assertNotNull(saved);
		Assert.assertEquals(issue, saved);
		
		issueRepository.findByProviderIdAndServiceIdAndId(issue.getProviderId(), issue.getServiceId(), saved.getId());
		Assert.assertNotNull(saved);
		Assert.assertEquals(issue, saved);
		
		List<ServiceIssue> list = issueRepository.findByProviderIdAndServiceId(issue.getProviderId(), issue.getServiceId());
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);

		list = issueRepository.findByUser(issue.getProviderId(), issue.getServiceId(), issue.getIssuer().getUserId());
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);

		issueRepository.delete(issue);
		saved = issueRepository.findByProviderIdAndExternalId(issue.getProviderId(), issue.getExternalId());
		Assert.assertNull(saved);
	}

	@Test
	public void testIssueSearch() throws ParseException {
		ServiceIssue issue = ObjectHelper.createIssue();
		ServiceIssue saved = issueRepository.save(issue);
		Assert.assertNotNull(saved);
		Assert.assertEquals(issue, saved);

		// search by status
		List<ServiceIssue> list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				Collections.singletonList(issue.getStatus()),
				null,
				null, 
				null,
				null,
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				Collections.singletonList("wrong status"),
				null,
				null, 
				null,
				null,
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertEquals(0,list.size());

		// search by status not
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				Collections.singletonList(issue.getStatus()),
				null, 
				null,
				null,
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertEquals(0,list.size());
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				Collections.singletonList("wrong status"),
				null, 
				null,
				null,
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);

		// search by dates
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				issue.getCreated()-1000*60*60*24,
				issue.getCreated()+1000*60*60*24,
				null, 
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				System.currentTimeMillis(), 
				System.currentTimeMillis()+1000*60*60*24,
				null,
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertEquals(0,list.size());
		
		// search by user
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				null, 
				null,
				issue.getIssuer().getUserId(),
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				null, 
				null,
				"wrong user",
				null,
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertEquals(0,list.size());

		// search by org
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null, 
				null,
				null,
				null,
				issue.getIssuer().getOrganizationId(),
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				null, 
				null,
				null,
				"wrong org",
				null,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertEquals(0,list.size());

		Circle circle = new Circle(issue.getLocation().getCoordinates()[0],issue.getLocation().getCoordinates()[1],1);
		// search by circle
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				null, 
				null,
				null,
				null,
				circle,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertTrue(list.size() > 0);
		circle = new Circle(issue.getLocation().getCoordinates()[0]+1,issue.getLocation().getCoordinates()[1]-1,1);
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null,
				null,
				null, 
				null,
				null,
				null,
				circle,
				null,
				null);
		Assert.assertNotNull(list);
		Assert.assertEquals(0,list.size());
		
		for (int i = 0; i < 20; i++) {
			issueRepository.save(ObjectHelper.createIssue());
		}
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null, null, null, null, null, null, null, 0, 10);
		Assert.assertEquals(10,list.size());
		
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null, null, null, null, null, null, null, 0, 30);
		Assert.assertEquals(21,list.size());
		
		list = issueRepository.search(issue.getProviderId(), issue.getServiceId(),
				null, null, null, null, null, null, null, 10, 10);
		Assert.assertEquals(10,list.size());

	}

}
