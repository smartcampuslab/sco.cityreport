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

package it.smartcommunitylab.cityreport.test;

import it.smartcommunitylab.cityreport.model.ATTRIBUTE_TYPE;
import it.smartcommunitylab.cityreport.model.Attribute;
import it.smartcommunitylab.cityreport.model.AttributeValue;
import it.smartcommunitylab.cityreport.model.Issuer;
import it.smartcommunitylab.cityreport.model.Location;
import it.smartcommunitylab.cityreport.model.Metadata;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.model.ServiceIssue;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;

/**
 * @author raman
 *
 */
public class ObjectHelper {

	public static Service createService() {
		Service service = new Service();
		service.setServiceId("serviceId");
		service.setProviderId("providerId");
		service.setAckMessage("ack message");
		service.setCategory("category");
		service.setKeywords(new String[]{"keyword1","keyword2"});
		service.setDescription("description");
		service.setExtensions(Collections.<String,Object>singletonMap("ext1", "extvalue1"));
		service.setName("service name");
		service.setExternalId("externalId"); 
		service.setMetadata(new Metadata());
		Attribute a = new Attribute();
		a.setCode("code");
		a.setEditable(true);
		a.setRequired(true);
		a.setDescription("descr");
		a.setLabel("label");
		a.setType(ATTRIBUTE_TYPE.SINGLEVALUELIST);
		AttributeValue av = new AttributeValue();
		av.setKey("key");
		av.setValue("value");
		a.setValue(Collections.singletonList(av));
		service.getMetadata().setAttribute(Collections.singletonList(a));
		return service;
	}

	/**
	 * @return
	 * @throws ParseException 
	 */
	public static ServiceIssue createIssue() throws ParseException {
		ServiceIssue issue = new ServiceIssue();
		issue.setProviderId("providerId");
		issue.setServiceId("serviceId");
		issue.setCreated(new SimpleDateFormat("dd-MM-yyy").parse("11-02-2015").getTime());
		issue.setUpdated(new SimpleDateFormat("dd-MM-yyy").parse("11-02-2015").getTime());
		issue.setDeadline(new SimpleDateFormat("dd-MM-yyy").parse("11-02-2015").getTime());
		issue.setIssuerLevel(5);
		issue.setNotes("notes");
		issue.setStatus("open");
		issue.setStatusNotes("status notes");
		issue.setExternalId("externalId");
		issue.setIssuer(new Issuer());
		issue.getIssuer().setEmail("email");
		issue.getIssuer().setName("name");
		issue.getIssuer().setOrganizationId("orgid");
		issue.getIssuer().setPhone("phone");
		issue.getIssuer().setSurname("surname");
		issue.getIssuer().setUserId("user");;
		issue.setLocation(new Location());
		issue.getLocation().setCoordinates(new double[]{1,1});
		issue.getLocation().setAddress("address");
		issue.setProviderLevel(10);
		issue.setMedia(Collections.singletonList("www"));
		issue.setResponsible("responsibe");
		issue.setAttribute(Collections.<String,Object>singletonMap("key1", "value1"));
		return issue;
	}
	
}
