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

import it.smartcommunitylab.cityreport.model.Issuer;

/**
 * @author raman
 *
 */
public class UserUtils {

	/**
	 * @return
	 */
	public static Issuer user() {
		Issuer issuer = new Issuer();
		// TODO fill in user data
		issuer.setUserId("1");
		return issuer;
	}

}
