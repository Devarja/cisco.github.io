
    // Jenkinsfile
    pipeline {
        agent {
            kubernetes {
                cloud 'kubernetes' // Use the Kubernetes cloud definition in Jenkins
                inheritFrom 'default' // Inherit from a default agent template if defined
                
            }
        }
        environment {
            
            DOCKER_HUB_USERNAME = 'devarajab'
            APP_IMAGE_NAME = "${DOCKER_HUB_USERNAME}/cisco-github-io-app"
            
            KUBERNETES_NAMESPACE = 'jenkins'
        }
        stages {
            stage('Checkout') {
                steps {
                    git branch: 'master', url: 'https://github.com/Devarja/cisco.github.io.git' // Replace with your repo details
                }
            }
            stage('Build Docker Image') {
                steps {
                    script {
                        
                        sh "docker build -t ${APP_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                    }
                }
            }
            
            
            stage('Deploy to Kubernetes') {
                steps {
                    script {
                        
                        
                        sh "kubectl apply -f cisco-github-io-deployment.yaml -n ${KUBERNETES_NAMESPACE}"
                        sh "kubectl apply -f cisco-github-io-service.yaml -n ${KUBERNETES_NAMESPACE}"

        
                        sh "kubectl rollout restart deployment/cisco-github-io-deployment -n ${KUBERNETES_NAMESPACE}"
                        sh "kubectl rollout status deployment/cisco-github-io-deployment -n ${KUBERNETES_NAMESPACE}"
                    }
                }
            }
        }
        post {
            always {
                echo 'Pipeline finished.'
            }
            failure {
                echo 'Pipeline failed!'
            }
        }
    }
    
