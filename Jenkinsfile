pipeline {
    agent any

    environment {
        IMAGE_NAME = "victobonetti/vinheria-service-1"
        TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat """
                        docker build -t %IMAGE_NAME%:%TAG% -t %IMAGE_NAME%:latest .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                        docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                        docker push %IMAGE_NAME%:%TAG%
                        docker push %IMAGE_NAME%:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat """
                    kubectl set image deployment/vinheria-service-1 vinheria-service-1=%IMAGE_NAME%:latest --record
                    kubectl rollout status deployment/vinheria-service-1
                """
            }
        }
    }
}
