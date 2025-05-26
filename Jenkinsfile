pipeline {
    agent any

    environment {
        IMAGE_NAME = "victobonetti/vinheria-service-1"
        TAG = "${env.BUILD_NUMBER}"
        PATH = "/usr/local/bin:${env.PATH}"
        PUBLISH_DIR = "publish"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Construir Serviço de Autenticação') {
            steps {
                script {
                    echo "Construindo Serviço de Autenticação..."
                    dir('auth-service') {
                        sh 'npm install'
                        sh 'npm run build'
                        echo "Construção do Serviço de Autenticação concluída."
                    }
                }
            }
        }

        stage('Construir Serviço de Produto') {
            steps {
                script {
                    echo "Construindo Serviço de Produto..."
                    dir('product-service') {
                        sh 'npm install'
                        sh 'npm run build'
                        echo "Construção do Serviço de Produto concluída."
                    }
                }
            }
        }

        stage('Deploy Vinheria Agnello') {
            steps {
                script {
                    echo "Fazendo deploy dos serviços da Vinheria Agnello..."
                    
                    // Cria diretórios de destino se não existirem
                    sh "mkdir -p ${env.PUBLISH_DIR}/auth"
                    sh "mkdir -p ${env.PUBLISH_DIR}/product"
                    
                    // Deploy auth-service
                    echo "Fazendo deploy do Serviço de Autenticação..."
                    sh "cp -r auth-service/src/* ${env.PUBLISH_DIR}/auth/"
                    echo "Serviço de Autenticação implantado em ${env.PUBLISH_DIR}/auth"

                    // Deploy product-service
                    echo "Fazendo deploy do Serviço de Produto..."
                    sh "cp -r product-service/src/* ${env.PUBLISH_DIR}/product/"
                    echo "Serviço de Produto implantado em ${env.PUBLISH_DIR}/product"

                    echo "Deploy da Vinheria Agnello concluído."
                    
                    // Cria arquivos marcadores de deploy
                    writeFile file: "${env.PUBLISH_DIR}/auth/deploy_marker.txt", text: "Serviço de Autenticação implantado em ${new Date()}"
                    writeFile file: "${env.PUBLISH_DIR}/product/deploy_marker.txt", text: "Serviço de Produto implantado em ${new Date()}"
                    
                    // Arquiva marcadores de deploy como artefatos
                    archiveArtifacts artifacts: "${env.PUBLISH_DIR}/auth/deploy_marker.txt, ${env.PUBLISH_DIR}/product/deploy_marker.txt", fingerprint: true
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline concluído.'
        }
        success {
            echo 'Pipeline bem-sucedido!'
            echo 'Deploy da Vinheria concluído.'
        }
        failure {
            echo 'Pipeline falhou!'
        }
    }
}
