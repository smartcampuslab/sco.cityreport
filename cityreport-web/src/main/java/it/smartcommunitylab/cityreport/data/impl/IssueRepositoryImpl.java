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

package it.smartcommunitylab.cityreport.data.impl;

import it.smartcommunitylab.cityreport.data.IssueCustomRepository;
import it.smartcommunitylab.cityreport.model.ServiceIssue;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.geo.Circle;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

/**
 * @author raman
 *
 */
public class IssueRepositoryImpl implements IssueCustomRepository {

	@Autowired
    private MongoTemplate mongoTemplate;

	@Override
	public List<ServiceIssue> search(String providerId, String serviceId, Collection<String> status, Collection<String> statusExclude, Long from, Long to, String userId, String orgId, Circle circle, Integer start, Integer count) {
		return search(providerId, Collections.singletonList(serviceId), status, statusExclude, from, to, userId, orgId, circle, start, count);
	}

	@Override
	public List<ServiceIssue> search(String providerId, Collection<String> serviceIds,  Collection<String> status, Collection<String> statusExclude, Long from, Long to, String userId, String orgId, Circle circle, Integer start, Integer count) {
        Criteria criteria = new Criteria();
		Query query = new Query();
    	criteria.and("providerId").is(providerId);
        if (serviceIds != null && !serviceIds.isEmpty()) {
        	criteria.and("serviceId").in(serviceIds);
        }
        if (status != null) {
        	criteria.and("status").in(status);
        }
        if (statusExclude != null) {
        	criteria.and("status").nin(statusExclude);
        }
        if (from != null && from > 0 && to != null && to > 0) {
        	criteria.andOperator(Criteria.where("created").lte(to),Criteria.where("created").gte(from));
        }
        else if (from != null && from > 0) {
        	criteria.and("created").gte(from);
        }
        else if (to != null && to > 0) {
        	criteria.and("created").lte(to);
        }
        if (userId != null) {
        	criteria.and("issuer.userId").is(userId);
        }
        if (orgId != null) {
        	criteria.and("issuer.organizationId").is(orgId);
        }
        if (circle != null) {
        	criteria.and("location.coordinates").within(circle);
        }
        query.addCriteria(criteria);
        if (start != null) {
        	query.skip(start);
        }
        if (count != null) {
        	query.limit(count);
        }
        query.with(new Sort(new Order(Direction.DESC, "created")));
//        System.err.println(query.getQueryObject().toMap());
		return mongoTemplate.find(query, ServiceIssue.class);
	}

}
