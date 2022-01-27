package com.arbindo.mimock.service;

import com.arbindo.mimock.entities.HttpMethod;
import com.arbindo.mimock.entities.Mock;
import com.arbindo.mimock.entities.ResponseContentType;
import com.arbindo.mimock.models.v1.CreateMockRequest;
import com.arbindo.mimock.repository.HttpMethodsRepository;
import com.arbindo.mimock.repository.MocksRepository;
import com.arbindo.mimock.repository.ResponseContentTypesRepository;
import com.arbindo.mimock.utilities.Extensions;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class MocksServiceImpl implements MocksService {

    @Autowired
    private MocksRepository mocksRepository;

    @Autowired
    private HttpMethodsRepository httpMethodsRepository;

    @Autowired
    private ResponseContentTypesRepository responseContentTypesRepository;

    @Override
    public List<Mock> getMocks() {
        return mocksRepository.findAll();
    }

    @Override
    public Mock getMockById(String mockId) {
        if(Extensions.IsNotNullOrEmpty(mockId)){
            return mocksRepository.getById(UUID.fromString(mockId));
        }
        log.log(Level.DEBUG, "Invalid Mock Id!");
        return null;
    }

    @Transactional
    @Override
    public Mock createMock(CreateMockRequest request) {
        if(Extensions.IsArgNull(request)){
            log.log(Level.DEBUG, "CreateMockRequest is null!");
            return null;
        }
        try {
            UUID mockId = UUID.randomUUID();
            HttpMethod httpMethod = GetHttpMethod(request.getHttpMethod());
            ResponseContentType responseContentType = GetResponseContentType(request.getResponseContentType());
            Mock mock = Mock.builder()
                    .id(mockId)
                    .route(request.getRoute())
                    .httpMethod(httpMethod)
                    .responseContentType(responseContentType)
                    .statusCode(request.getStatusCode())
                    .queryParams(request.getQueryParams())
                    .createdAt(ZonedDateTime.now())
                    .build();

            return mocksRepository.save(mock);
        } catch (Exception e){
            log.log(Level.DEBUG, e.getMessage());
        }
        return null;
    }

    private HttpMethod GetHttpMethod(String httpMethodString) throws Exception {
        if(Extensions.IsNotNullOrEmpty(httpMethodString)){
            return httpMethodsRepository.findByMethod(httpMethodString);
        }
        throw new Exception(String.format("Unable to extract HTTP Method!! Invalid method: %s", httpMethodString));
    }

    private ResponseContentType GetResponseContentType(String responseContentTypeString) throws Exception {
        if(Extensions.IsNotNullOrEmpty(responseContentTypeString)){
            return responseContentTypesRepository.findByResponseType(responseContentTypeString);
        }
        throw new Exception(String.format("Unable to extract Response Content Type!! Invalid responseContentType: %s", responseContentTypeString));
    }
}
