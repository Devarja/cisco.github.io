pipeline{
       agent any
   
   environment {
    // Replace with your Docker Hub username and image name
    DOCKER_IMAGE = "devarajab/cisco-image"
    // Reference the credentials ID configured in Jenkins
}

stages {
    stage('Checkout Code') {
        steps {
            git 'https://github.com/Devarja/cisco.github.io.git' // Replace with your repository URL
        }
    }
    stage('Build Docker Image') {
        steps {
            script {
                // Build the Docker image using the Dockerfile in the current directory
                // Tag the image with the build number and 'latest'
                sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            }
        }
    }
}
post {
    always {
        // Log out from Docker Hub after the pipeline completes
        script {
            sh 'echo success'
        }
    }
} 
}
