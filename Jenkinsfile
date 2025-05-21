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
                    sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}:${TAG}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                    kubectl set image deployment/${IMAGE_NAME.split('/')[1]} ${IMAGE_NAME.split('/')[1]}=${IMAGE_NAME}:${TAG} --record
                    """
                }
            }
        }
    }
}