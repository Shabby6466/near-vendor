// ***********************
//
// Build and deploy different environments with jenkins pipeline
//
// ***********************

def CONTAINER_NAME="nearvendor/backend"
def CONTAINER_TAG="0.0.1"
def DOCKER_HUB_USER="terarare"
def CURRENT_DIR='.'
def GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'

pipeline {

    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
         stage('Prepare workspace') {
            steps {
                echo 'Prepare workspace'
                step([$class: 'WsCleanup'])
                checkout scm
            }
        }

        stage('Setup environment') {
            steps {
                echo 'Setup environment'
                script {
                    def fullBranchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'unknown'
                    echo "Actual Branch detected: ${fullBranchName}"

                    // Normalize branch name
                    def branchName = fullBranchName.replace('origin/', '').trim()
                    echo "Normalized Branch name: ${branchName}"

                    if (branchName == 'main' || branchName == 'master' || branchName.contains('main')) {
                        GLOBAL_ENVIRONMENT = 'production'
                    } else if (branchName.contains('development')) {
                        GLOBAL_ENVIRONMENT = 'development'
                    } else {
                        GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'
                    }

                    echo 'Branch To Build: ' + branchName
                    echo 'Environment Set To: ' + GLOBAL_ENVIRONMENT
                }
            }
        }

        stage('Deploy to VPS') {
            when {
                expression { GLOBAL_ENVIRONMENT != 'NO_DEPLOYMENT' }
            }
            steps {
                script {
                    echo "Deploying ${GLOBAL_ENVIRONMENT} to VPS..."
                    
                    withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                        def vpsIp = "76.13.223.103"
                        def vpsUser = "root"
                        // Adjust this path to your VPS project location
                        def vpsPath = "/root/projects/terarare/near-vendor"
                        def archiveName = "project-${env.BUILD_NUMBER}.tar.gz"
                        def localArchivePath = "/tmp/${archiveName}"

                        echo "Archiving files to ${localArchivePath}..."
                        // We create the archive in /tmp to avoid 'file changed as we read it' error
                        sh "tar -czf ${localArchivePath} --exclude='node_modules' --exclude='.git' ."

                        echo "Syncing archive to VPS..."
                        sh "scp -i ${env.SSH_KEY} -o StrictHostKeyChecking=no ${localArchivePath} ${vpsUser}@${vpsIp}:${vpsPath}/project.tar.gz"

                        echo "Extracting archive and running deployment script on VPS..."
                        sh "ssh -i ${env.SSH_KEY} -o StrictHostKeyChecking=no ${vpsUser}@${vpsIp} 'cd ${vpsPath} && tar -xzf project.tar.gz && rm project.tar.gz && chmod +x ./deploy/deploy.sh && ./deploy/deploy.sh build && ./deploy/deploy.sh start'"
                        
                        // Clean up the local archive after transfer
                        sh "rm ${localArchivePath}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Retrieve the webhook URL from credentials
                try {
                    withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_URL')]) {
                        def color = currentBuild.currentResult == 'SUCCESS' ? 'GREEN' : 'RED'
                        def status = currentBuild.currentResult ?: 'IN PROGRESS'
                        
                        discordSend(
                            webhookURL: "${DISCORD_URL}",
                            title: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                            link: "${env.BUILD_URL}",
                            description: "Branch: ${env.BRANCH_NAME}\nStatus: ${status}",
                            result: "${status}",
                            thumbnail: "https://jenkins.io/images/logos/jenkins/jenkins.png"
                        )
                    }
                } catch (Exception e) {
                    echo "Discord notification failed: ${e.message}"
                }
            }
        }
    }
}
