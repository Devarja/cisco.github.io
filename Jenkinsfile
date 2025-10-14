pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devarajab/cisco-image"
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

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Update deployment.yaml to use the locally built image tag
                    sh """
                    sed -i.bak 's|image:.*|image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}|' deployment.yaml
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml
                    """
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
