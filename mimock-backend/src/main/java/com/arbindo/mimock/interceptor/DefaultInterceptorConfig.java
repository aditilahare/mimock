package com.arbindo.mimock.interceptor;

import com.arbindo.mimock.constants.UrlConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class DefaultInterceptorConfig implements WebMvcConfigurer {
    @Autowired
    private DefaultHttpInterceptor defaultHttpInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(defaultHttpInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(UrlConfig.API_PATH + UrlConfig.VERSION + "/**")
                .excludePathPatterns("/")
                .excludePathPatterns("index.html")
                .excludePathPatterns("/index.html")
                .excludePathPatterns("favicon.ico")
                .excludePathPatterns("/favicon.ico")
                .excludePathPatterns("/error");
    }
}