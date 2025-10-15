peline {
    agent any

    environment {
        DOCKER_IMAGE = "devarajab/cisco-image"
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Devarja/cisco.github.io.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                    // Add docker login if needed here
                    sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Update Deployment YAML') {
            steps {
                script {
                    sh "sed -i.bak 's|image:.*|image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}|' cisco-github-io-deployment.yaml"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        kubectl --kubeconfig=$KUBECONFIG_FILE apply -f cisco-github-io-deployment.yaml --validate=false
                        kubectl --kubeconfig=$KUBECONFIG_FILE apply -f cisco-github-io-service.yaml --validate=false
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully and exposed via Kubernetes service.'
        }
        failure {
            echo 'Deployment failed. Check the Jenkins logs for details.'
        }
    }
