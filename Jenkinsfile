pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devarajab/cisco-image"
        DOCKER_REGISTRY = "your-docker-registry" // e.g., docker.io or your private registry
        KUBECONFIG_CREDENTIALS_ID = "kubeconfig-credentials" // Jenkins credential ID for kubeconfig file
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Devarja/cisco.github.io.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login to Docker registry if needed
                    // sh "docker login -u <username> -p <password> ${DOCKER_REGISTRY}"
                    sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                    script {
                        // Update image tag in deployment.yaml dynamically if needed
                        sh """
                        sed -i.bak 's|image:.*|image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}|' deployment.yaml
                        kubectl --kubeconfig=$KUBECONFIG apply -f deployment.yaml
                        kubectl --kubeconfig=$KUBECONFIG apply -f service.yaml
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                sh 'echo Pipeline completed successfully'
            }
        }
    }
}
