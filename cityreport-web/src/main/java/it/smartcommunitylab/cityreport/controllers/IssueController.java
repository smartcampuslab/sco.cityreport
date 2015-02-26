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
import it.smartcommunitylab.cityreport.model.Issuer;
import it.smartcommunitylab.cityreport.model.Response;
import it.smartcommunitylab.cityreport.model.Service;
import it.smartcommunitylab.cityreport.model.ServiceIssue;
import it.smartcommunitylab.cityreport.security.UserAuthenticator;
import it.smartcommunitylab.cityreport.services.IssueManager;
import it.smartcommunitylab.cityreport.services.ServiceManager;
import it.smartcommunitylab.cityreport.utils.Constants;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Circle;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
	@Autowired
	private UserAuthenticator userAuthenticator;
	
	@RequestMapping(method=RequestMethod.GET, value="/{providerId}/services/{serviceId}/issues/{issueId}")
	public @ResponseBody Response<ServiceIssue> getIssue(@PathVariable String providerId, @PathVariable String serviceId, String issueId) {
		return new Response<ServiceIssue>(manager.findIssue(issueId, serviceId, providerId));
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/{providerId}/services/{serviceId}/issues")
	public @ResponseBody Response<List<ServiceIssue>> getServiceIssues(
			@PathVariable String providerId, 
			@PathVariable String serviceId,
			@RequestParam(required=false) String status,
			@RequestParam(required=false) String not_status,
			@RequestParam(required=false) Long from,
			@RequestParam(required=false) Long to,
			@RequestParam(required=false) Double lat,
			@RequestParam(required=false) Double lng,
			@RequestParam(required=false) Double radius,
			@RequestParam(required=false) String user_id,
			@RequestParam(required=false) String org_id,
			@RequestParam(required=false) Integer start,
			@RequestParam(required=false) Integer count
		) {
		Circle circle = null;
		if (lat != null && lng != null) {
			circle = new Circle(lat, lng, radius == null ? Constants.RADIUS_DEFAULT : radius);
		}
		return new Response<List<ServiceIssue>>(manager.findIssues(
				providerId, 
				serviceId, 
				StringUtils.hasText(status) ? StringUtils.commaDelimitedListToSet(status) : null, 
				StringUtils.hasText(not_status) ? StringUtils.commaDelimitedListToSet(not_status) : null, 
				from, 
				to, 
				user_id, 
				org_id, 
				circle, 
				start, 
				count));
	}


	@RequestMapping(method=RequestMethod.GET, value="/{providerId}/services/{serviceId}/user/{userId}/issues")
	public @ResponseBody Response<List<ServiceIssue>> getServiceIssues(@PathVariable String providerId, @PathVariable String serviceId, @PathVariable String userId) {
		return new Response<List<ServiceIssue>>(manager.findUserIssues(providerId, serviceId, userId));
	}

	@RequestMapping(method=RequestMethod.POST, value = "/{providerId}/services/{serviceId}/user/issues")
	public @ResponseBody Response<IssueResponse> reportUserIssue(
			@PathVariable String providerId, 
			@PathVariable String serviceId, 
			@RequestBody ServiceIssue issue,
			HttpServletRequest req) 
	{
		Issuer issuer = userAuthenticator.identifyUser(req);
		
		Service service = serviceManager.findService(serviceId, providerId);
		if (service == null) {
			return new Response<IssueResponse>(HttpStatus.NOT_FOUND.value(),"Unknown service");
		}
		issue.setProviderId(providerId);
		issue.setServiceId(serviceId);
		issue.setIssuer(issuer);
		ServiceIssue result = manager.createIssue(issue);
		return new Response<IssueResponse>(new IssueResponse(providerId, serviceId, result.getId(), service.getAckMessage()));
	}
	
	@ExceptionHandler(Exception.class)
	public @ResponseBody Response<Void> handleExceptions(Exception exception) {
		if (exception instanceof SecurityException) {
			return new Response<Void>(403, exception.getMessage());
		}
		
		return new Response<Void>(500, exception.getMessage());
	}

}
