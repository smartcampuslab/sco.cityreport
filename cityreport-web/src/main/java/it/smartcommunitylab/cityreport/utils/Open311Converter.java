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

package it.smartcommunitylab.cityreport.utils;

import it.smartcommunitylab.cityreport.model.AttributeValue;
import it.smartcommunitylab.cityreport.model.Metadata;
import it.smartcommunitylab.cityreport.model.ServiceIssue;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.xml.datatype.DatatypeFactory;

import org.joda.time.DateTime;
import org.open311.wiki.georeport_v2.Attribute;
import org.open311.wiki.georeport_v2.Attribute.Values;
import org.open311.wiki.georeport_v2.DataType;
import org.open311.wiki.georeport_v2.Error;
import org.open311.wiki.georeport_v2.Errors;
import org.open311.wiki.georeport_v2.Request;
import org.open311.wiki.georeport_v2.Service;
import org.open311.wiki.georeport_v2.ServiceDefinition;
import org.open311.wiki.georeport_v2.ServiceDefinition.Attributes;
import org.open311.wiki.georeport_v2.ServiceRequests;
import org.open311.wiki.georeport_v2.ServiceType;
import org.open311.wiki.georeport_v2.Services;
import org.open311.wiki.georeport_v2.Value;
import org.springframework.util.StringUtils;

/**
 * Converter for Open311 data structures.
 * @author raman
 *
 */
public class Open311Converter {

	public static long Open311DateTimeToTimestamp(String date) throws Exception {
		return DatatypeFactory.newInstance().newXMLGregorianCalendar(date).toGregorianCalendar().getTimeInMillis();
	}
	
	public static Errors toOpen311Errors(int code, String desc) {
		return new Errors(Collections.singletonList(new Error(BigInteger.valueOf(code), desc)));
	}
	
	public static ServiceRequests toOpen311RequestCreation(String id, String ack, String accountId) {
		Request req = new Request();
		req.setAccountId(accountId);
		req.setServiceRequestId(id);
		req.setServiceNotice(ack);
		return new ServiceRequests(Collections.singletonList(req));
	}

	public static ServiceRequests toOpen311Request(ServiceIssue issue, it.smartcommunitylab.cityreport.model.Service service) {
		List<Request> requests = new ArrayList<Request>();
		requests.add(toOpen311RequestObject(issue, service));
		return new ServiceRequests(requests);
	}

	public static ServiceRequests toOpen311RequestList(List<ServiceIssue> issues, it.smartcommunitylab.cityreport.model.Service service) {
		List<Request> requests = new ArrayList<Request>();
		if (issues != null) {
			for (ServiceIssue si : issues) {
				requests.add(toOpen311RequestObject(si, service));
			}
		}
		return new ServiceRequests(requests );
	}
	
	public static Request toOpen311RequestObject(ServiceIssue si, it.smartcommunitylab.cityreport.model.Service service) {
		return new Request(
				si.getId(), 
				null, 
				null, 
				si.getIssuer() == null ? null : 
					si.getIssuer().getUserId() != null ? si.getIssuer().getUserId() : si.getIssuer().getOrganizationId(), 
				si.getStatus(), 
				si.getStatusNotes(), 
				service.getName(), 
				service.getServiceId(), 
				si.getNotes(), 
				si.getResponsible(), 
				new DateTime(si.getCreated()), 
				new DateTime(si.getUpdated()), 
				new DateTime(si.getDeadline()), 
				si.getLocation() == null ? null : si.getLocation().getAddress(), 
				null, 
				null, 
				si.getLocation() == null || si.getLocation().getCoordinates() == null ? null : si.getLocation().getCoordinates()[0], 
				si.getLocation() == null || si.getLocation().getCoordinates() == null ? null : si.getLocation().getCoordinates()[1], 
				si.getMedia() == null || si.getMedia().isEmpty() ? null : si.getMedia().get(0));
	}

	public static Service toOpen311Service(it.smartcommunitylab.cityreport.model.Service service) {
		Service res = new Service(
				service.getServiceId(), 
				service.getName(), 
				service.getDescription(), 
				service.getMetadata() != null && service.getMetadata().getAttribute() != null && service.getMetadata().getAttribute().size() > 0, 
				ServiceType.REALTIME, 
				StringUtils.arrayToCommaDelimitedString(service.getKeywords()), 
				service.getCategory());
		return res;
	}
	
	public static ServiceDefinition toOpen311ServiceDefinition(it.smartcommunitylab.cityreport.model.Service service) {
		ServiceDefinition res = new ServiceDefinition(
				service.getServiceId(),
				toOpen311Attributes(service.getMetadata()));
		return res;
	}

	/**
	 * @param metadata
	 * @return
	 */
	private static Attributes toOpen311Attributes(Metadata metadata) {
		List<Attribute> attributes = new ArrayList<Attribute>();
		if (metadata != null && metadata.getAttribute() != null) {
			int order = 0;
			for (it.smartcommunitylab.cityreport.model.Attribute a : metadata.getAttribute()) {
				attributes.add(toOpen311Attribute(a, order++));
			}
		}
		return new Attributes(attributes);
	}

	/**
	 * @param a
	 * @return
	 */
	private static Attribute toOpen311Attribute(it.smartcommunitylab.cityreport.model.Attribute a, int order) {
		return new Attribute(
				a.isEditable(),
				a.getCode(),
				DataType.fromValue(a.getType().toString()),
				a.isRequired(),
				null,
				BigInteger.valueOf(order),
				a.getDescription(),
				toOpen311Values(a.getValue()));
	}

	/**
	 * @param value
	 * @return
	 */
	private static Values toOpen311Values(List<AttributeValue> valueList) {
		List<Value> values = new ArrayList<Value>();
		if (valueList != null) {
			for (AttributeValue v : valueList) {
				values.add(new Value(v.getKey(), v.getValue().toString()));
			}
		}
		return new Values(values);
	}

	/**
	 * @param findServices
	 * @return
	 */
	public static Services toOpen311ServiceList(List<it.smartcommunitylab.cityreport.model.Service> findServices) {
		List<Service> services = new ArrayList<Service>();
		if (findServices != null)
			for (it.smartcommunitylab.cityreport.model.Service s : findServices) 
				services.add(toOpen311Service(s));
		return new Services(services);
	}
}
