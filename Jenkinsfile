pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devarajab/cisco-image"
        KUBECONFIG = '/root/.kube/config' // Adjust if your kubeconfig path differs inside Jenkins
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Devarja/cisco.github.io.git' // Your repo URL
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image with build number tag and latest tag
                    sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    // Replace image tag in deployment.yaml with the newly built image tag
                    sh "sed -i.bak 's|image:.*|image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}|' deployment.yaml"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply the updated deployment and service YAML files to the cluster
                    sh "kubectl apply -f deployment.yaml"
                    sh "kubectl apply -f service.yaml"
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Pipeline completed successfully'
            }
        }
    }
}
