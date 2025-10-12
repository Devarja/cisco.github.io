```groovy
    // Jenkinsfile
    pipeline {
        agent {
            kubernetes {
                cloud 'kubernetes' // Use the Kubernetes cloud definition in Jenkins
                inheritFrom 'default' // Inherit from a default agent template if defined
                
            }
        }
        environment {
            # Replace with your Docker Hub username
            DOCKER_HUB_USERNAME = 'devarajab'
            APP_IMAGE_NAME = "${DOCKER_HUB_USERNAME}/cisco-github-io-app"
            # Replace with your Kubernetes namespace if different from 'default'
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
                        # Build the Docker image
                        sh "docker build -t ${APP_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                    }
                }
            }
            stage('Push Docker Image') {
                steps {
                    script {
                        # Authenticate with Docker Hub using Jenkins credentials
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                            sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                            sh "docker push ${APP_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker tag ${APP_IMAGE_NAME}:${env.BUILD_NUMBER} ${APP_IMAGE_NAME}:latest"
                            sh "docker push ${APP_IMAGE_NAME}:latest"
                        }
                    }
                }
            }
            
            stage('Deploy to Kubernetes') {
                steps {
                    script {
                        # Apply the Kubernetes Deployment and Service
                        # Ensure your deployment.yaml points to the correct image name:tag
                        sh "kubectl apply -f cisco-github-io-deployment.yaml -n ${KUBERNETES_NAMESPACE}"
                        sh "kubectl apply -f cisco-github-io-service.yaml -n ${KUBERNETES_NAMESPACE}"

                        # Optional: Rollout restart to ensure new image is picked up
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
    ```
