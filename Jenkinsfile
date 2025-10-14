pipeline {
    agent { label 'docker' }
		    stages {
		        stage('Build Docker Image') {
		            steps {
		                sh 'docker build -t devarajab/cisco-image:1 .'
		            }
		        }
		    }
		}

    // environment {
    //     DOCKER_IMAGE = "devarajab/cisco-image"  // Change to your image name
    //     KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'             // Jenkins credential ID for kubeconfig file
    // }

    // stages {
    //     stage('Clone Repository') {
    //         steps {
    //             git 'https://github.com/Devarja/cisco.github.io.git'  // Replace with your repo URL
    //         }
    //     }

    //     stage('Build Docker Image') {
    //         steps {
    //             script {
    //                 // Build Docker image with build number tag and latest tag
    //                 sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
    //                 sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
    //             }
    //         }
    //     }

        stage('Update Deployment YAML') {
            steps {
                script {
                    // Replace image tag in deployment.yaml with the newly built image tag
                    sh "sed -i.bak 's|image:.*|image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}|' cisco-github-io-deployment.yaml"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG_FILE')]) {
                    script {
                        // Apply deployment and service YAML files using the kubeconfig file
                        sh "kubectl --kubeconfig=${KUBECONFIG_FILE} apply -f cisco-github-io-deployment.yaml --validate=false"
                        sh "kubectl --kubeconfig=${KUBECONFIG_FILE} apply -f cisco-github-io-service.yaml --validate=false"
                    }
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
}
