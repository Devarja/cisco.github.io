pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devarajab/cisco-image"          // Your Docker Hub image name
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'         // Jenkins credential ID for kubeconfig file
        DOCKERHUB_CREDENTIAL_ID = 'dockerhubcreds' // Jenkins credential ID for Docker Hub (username/password)
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
                }
            }
        }

        stage('Docker Login and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIAL_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                        sh "docker logout"
                    }
                }
            }
        }

        stage('Update Deployment YAML') {
            steps {
                script {
                    // Replace only the image line with the new tag in deployment YAML
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
}

