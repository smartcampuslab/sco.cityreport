package it.smartcommunitylab.cityreport.test;

import java.net.UnknownHostException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@Configuration
@ComponentScan(basePackages = {"it.smartcommunitylab.cityreport.security","it.smartcommunitylab.cityreport.services"})
@EnableMongoRepositories(basePackages = "it.smartcommunitylab.cityreport.data")
public class TestConfig {

	@Bean(name="mongoTemplate")
	public MongoTemplate getMongoTemplate() throws UnknownHostException, MongoException {
		return new MongoTemplate(new MongoClient(), "cityreport-test");
	}
}
