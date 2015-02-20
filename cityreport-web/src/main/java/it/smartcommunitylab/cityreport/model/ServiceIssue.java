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

package it.smartcommunitylab.cityreport.model;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author raman
 *
 */
@Document
public class ServiceIssue {
	private String serviceId;
	private String providerId;
	@Id
	private String id;
	private String externalId;
	private Location location;
	private Issuer issuer;
	
	private Map<String,Object> attribute;
	private String notes;
	private List<String> media;
	
	private Long created;
	private Long updated;
	private Long deadline;
	
	private String status;
	private String statusNotes;
	
	private String responsible;
	private Integer issuerLevel;
	private Integer providerLevel;
	/**
	 * @return the serviceId
	 */
	public String getServiceId() {
		return serviceId;
	}
	/**
	 * @param serviceId the serviceId to set
	 */
	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}
	/**
	 * @return the providerId
	 */
	public String getProviderId() {
		return providerId;
	}
	/**
	 * @param providerId the providerId to set
	 */
	public void setProviderId(String providerId) {
		this.providerId = providerId;
	}
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the externalId
	 */
	public String getExternalId() {
		return externalId;
	}
	/**
	 * @param externalId the externalId to set
	 */
	public void setExternalId(String externalId) {
		this.externalId = externalId;
	}
	/**
	 * @return the location
	 */
	public Location getLocation() {
		return location;
	}
	/**
	 * @param location the location to set
	 */
	public void setLocation(Location location) {
		this.location = location;
	}
	/**
	 * @return the issuer
	 */
	public Issuer getIssuer() {
		return issuer;
	}
	/**
	 * @param issuer the issuer to set
	 */
	public void setIssuer(Issuer issuer) {
		this.issuer = issuer;
	}
	/**
	 * @return the attribute
	 */
	public Map<String, Object> getAttribute() {
		return attribute;
	}
	/**
	 * @param attribute the attribute to set
	 */
	public void setAttribute(Map<String, Object> attribute) {
		this.attribute = attribute;
	}
	/**
	 * @return the notes
	 */
	public String getNotes() {
		return notes;
	}
	/**
	 * @param notes the notes to set
	 */
	public void setNotes(String notes) {
		this.notes = notes;
	}
	/**
	 * @return the media
	 */
	public List<String> getMedia() {
		return media;
	}
	/**
	 * @param media the media to set
	 */
	public void setMedia(List<String> media) {
		this.media = media;
	}
	/**
	 * @return the created
	 */
	public Long getCreated() {
		return created;
	}
	/**
	 * @param created the created to set
	 */
	public void setCreated(Long created) {
		this.created = created;
	}
	/**
	 * @return the updated
	 */
	public Long getUpdated() {
		return updated;
	}
	/**
	 * @param updated the updated to set
	 */
	public void setUpdated(Long updated) {
		this.updated = updated;
	}
	/**
	 * @return the deadline
	 */
	public Long getDeadline() {
		return deadline;
	}
	/**
	 * @param deadline the deadline to set
	 */
	public void setDeadline(Long deadline) {
		this.deadline = deadline;
	}
	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}
	/**
	 * @return the statusNotes
	 */
	public String getStatusNotes() {
		return statusNotes;
	}
	/**
	 * @param statusNotes the statusNotes to set
	 */
	public void setStatusNotes(String statusNotes) {
		this.statusNotes = statusNotes;
	}
	/**
	 * @return the responsible
	 */
	public String getResponsible() {
		return responsible;
	}
	/**
	 * @param responsible the responsible to set
	 */
	public void setResponsible(String responsible) {
		this.responsible = responsible;
	}
	/**
	 * @return the issuerLevel
	 */
	public Integer getIssuerLevel() {
		return issuerLevel;
	}
	/**
	 * @param issuerLevel the issuerLevel to set
	 */
	public void setIssuerLevel(Integer issuerLevel) {
		this.issuerLevel = issuerLevel;
	}
	/**
	 * @return the providerLevel
	 */
	public Integer getProviderLevel() {
		return providerLevel;
	}
	/**
	 * @param providerLevel the providerLevel to set
	 */
	public void setProviderLevel(Integer providerLevel) {
		this.providerLevel = providerLevel;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((attribute == null) ? 0 : attribute.hashCode());
		result = prime * result + ((created == null) ? 0 : created.hashCode());
		result = prime * result
				+ ((deadline == null) ? 0 : deadline.hashCode());
		result = prime * result
				+ ((externalId == null) ? 0 : externalId.hashCode());
		result = prime * result + ((issuer == null) ? 0 : issuer.hashCode());
		result = prime * result
				+ ((issuerLevel == null) ? 0 : issuerLevel.hashCode());
		result = prime * result
				+ ((location == null) ? 0 : location.hashCode());
		result = prime * result + ((media == null) ? 0 : media.hashCode());
		result = prime * result + ((notes == null) ? 0 : notes.hashCode());
		result = prime * result
				+ ((providerId == null) ? 0 : providerId.hashCode());
		result = prime * result
				+ ((providerLevel == null) ? 0 : providerLevel.hashCode());
		result = prime * result
				+ ((responsible == null) ? 0 : responsible.hashCode());
		result = prime * result
				+ ((serviceId == null) ? 0 : serviceId.hashCode());
		result = prime * result + ((status == null) ? 0 : status.hashCode());
		result = prime * result
				+ ((statusNotes == null) ? 0 : statusNotes.hashCode());
		result = prime * result + ((updated == null) ? 0 : updated.hashCode());
		return result;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ServiceIssue other = (ServiceIssue) obj;
		if (attribute == null) {
			if (other.attribute != null)
				return false;
		} else if (!attribute.equals(other.attribute))
			return false;
		if (created == null) {
			if (other.created != null)
				return false;
		} else if (!created.equals(other.created))
			return false;
		if (deadline == null) {
			if (other.deadline != null)
				return false;
		} else if (!deadline.equals(other.deadline))
			return false;
		if (externalId == null) {
			if (other.externalId != null)
				return false;
		} else if (!externalId.equals(other.externalId))
			return false;
		if (issuer == null) {
			if (other.issuer != null)
				return false;
		} else if (!issuer.equals(other.issuer))
			return false;
		if (issuerLevel == null) {
			if (other.issuerLevel != null)
				return false;
		} else if (!issuerLevel.equals(other.issuerLevel))
			return false;
		if (location == null) {
			if (other.location != null)
				return false;
		} else if (!location.equals(other.location))
			return false;
		if (media == null) {
			if (other.media != null)
				return false;
		} else if (!media.equals(other.media))
			return false;
		if (notes == null) {
			if (other.notes != null)
				return false;
		} else if (!notes.equals(other.notes))
			return false;
		if (providerId == null) {
			if (other.providerId != null)
				return false;
		} else if (!providerId.equals(other.providerId))
			return false;
		if (providerLevel == null) {
			if (other.providerLevel != null)
				return false;
		} else if (!providerLevel.equals(other.providerLevel))
			return false;
		if (responsible == null) {
			if (other.responsible != null)
				return false;
		} else if (!responsible.equals(other.responsible))
			return false;
		if (serviceId == null) {
			if (other.serviceId != null)
				return false;
		} else if (!serviceId.equals(other.serviceId))
			return false;
		if (status == null) {
			if (other.status != null)
				return false;
		} else if (!status.equals(other.status))
			return false;
		if (statusNotes == null) {
			if (other.statusNotes != null)
				return false;
		} else if (!statusNotes.equals(other.statusNotes))
			return false;
		if (updated == null) {
			if (other.updated != null)
				return false;
		} else if (!updated.equals(other.updated))
			return false;
		return true;
	}

	
	
}
