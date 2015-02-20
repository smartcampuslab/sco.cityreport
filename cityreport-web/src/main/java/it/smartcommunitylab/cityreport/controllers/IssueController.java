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

import it.smartcommunitylab.cityreport.model.IssueResponse;
import it.smartcommunitylab.cityreport.model.Response;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.model.ServiceIssue;
import it.smartcommunitylab.cityreport.services.IssueManager;
import it.smartcommunitylab.cityreport.services.ServiceManager;
import it.smartcommunitylab.cityreport.utils.UserUtils;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author raman
 *
 */
@Controller
public class IssueController {

	@Autowired
	private IssueManager manager;
	@Autowired
	private ServiceManager serviceManager;
	
	@RequestMapping(method=RequestMethod.GET, value="/{providerId}/services/{serviceId}/issue/{issueId}")
	public @ResponseBody Response<ServiceIssue> getIssue(@PathVariable String providerId, @PathVariable String serviceId, String issueId) {
		return new Response<ServiceIssue>(manager.findIssue(issueId, serviceId, providerId));
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/{providerId}/services/{serviceId}/issue")
	public @ResponseBody Response<List<ServiceIssue>> getServiceIssues(@PathVariable String providerId, @PathVariable String serviceId) {
		return new Response<List<ServiceIssue>>(manager.findServiceIssues(providerId, serviceId));
	}

	@RequestMapping(method=RequestMethod.GET, value="/{providerId}/services/{serviceId}/user/{userId}/issues")
	public @ResponseBody Response<List<ServiceIssue>> getServiceIssues(@PathVariable String providerId, @PathVariable String serviceId, @PathVariable String userId) {
		return new Response<List<ServiceIssue>>(manager.findUserIssues(providerId, serviceId, userId));
	}

	@RequestMapping(method=RequestMethod.POST, value = "/{providerId}/services/{serviceId}/user/issues")
	public @ResponseBody Response<IssueResponse> reportUserIssue(@PathVariable String providerId, @PathVariable String serviceId, @RequestBody ServiceIssue issue) {

		Service service = serviceManager.findService(serviceId, providerId);
		if (service == null) {
			return new Response<IssueResponse>(HttpStatus.NOT_FOUND.value(),"Unknown service");
		}
		issue.setProviderId(providerId);
		issue.setServiceId(serviceId);
		issue.setIssuer(UserUtils.user());
		ServiceIssue result = manager.saveIssue(issue);
		return new Response<IssueResponse>(new IssueResponse(providerId, serviceId, result.getId(), service.getAckMessage()));
	}
}
