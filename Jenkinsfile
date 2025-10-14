pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devarajab/cisco-image"
        // KUBECONFIG path inside the Jenkins agent/container
        KUBECONFIG = "${env.WORKSPACE}/.kube/config"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Devarja/cisco.github.io.git'
            }
        }

        stage('Prepare Kubeconfig') {
            steps {
                // Inject the kubeconfig credential file into the workspace
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        mkdir -p $(dirname ${KUBECONFIG})
                        cp ${KUBECONFIG_FILE} ${KUBECONFIG}
                        chmod 600 ${KUBECONFIG}
                    '''
                }
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

        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    sh "sed -i.bak 's|image:.*|image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}|' cisco-github-io-deployment.yaml"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Use the KUBECONFIG environment variable to point kubectl to the injected config
                    sh "kubectl --kubeconfig=${KUBECONFIG} apply -f cisco-github-io-deployment.yaml --validate=false"
                    sh "kubectl --kubeconfig=${KUBECONFIG} apply -f cisco-github-io-service.yaml --validate=false"
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
