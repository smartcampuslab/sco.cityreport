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

package it.smartcommunitylab.cityreport.data;

import java.util.List;

import it.smartcommunitylab.cityreport.model.ServiceIssue;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * @author raman
 *
 */
public interface IssueRepository extends MongoRepository<ServiceIssue, String>, IssueCustomRepository {

	public List<ServiceIssue> findByProviderIdAndServiceId(String providerId, String serviceId);
	public ServiceIssue findByProviderIdAndServiceIdAndId(String providerId, String serviceId, String id);
	public ServiceIssue findByProviderIdAndExternalId(String providerId, String externalId);
	
    @Query("{'providerId':?0,'serviceId':?1, 'issuer.userId':?2}")
	public List<ServiceIssue> findByUser(String providerId, String serviceId, String userId);
}
