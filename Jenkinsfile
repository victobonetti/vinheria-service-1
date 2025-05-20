pipeline {
    agent any

    environment {
        IMAGE_NAME = 'victobonetti/vinheria-service-1:latest'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-credentials-id'
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
                    docker.build("${IMAGE_NAME}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'docker-registry-creds', url: '']) {
                    script {
                        docker.image("${IMAGE_NAME}").push()
                    }
                }
            }
        }

        stage('Refresh Kubernetes Pod') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIAL_ID}", variable: 'KUBECONFIG')]) {
                    sh '''
                    kubectl --kubeconfig=$KUBECONFIG delete pod -l app=dummy-node-app
                    '''
                }
            }
        }
    }
}
