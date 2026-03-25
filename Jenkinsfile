// ***********************
//
// Build and deploy different environments with jenkins pipeline
//
// Merge to develop -> triggers development release
// Merge to master without tag -> triggers staging release
// Merge to master with tag -> triggers staging and production release
// Production release requires manual approval on the jenkins job
//
// Configure jenkins pipeline project to pull tags! By default, tags are not pulled!
// -> Check "Advanced clone behaviours" feature of jenkins git plugin
//
// ***********************

def CONTAINER_NAME="nearvendor/backend"
def CONTAINER_TAG="0.0.1"
def DOCKER_HUB_USER="terarare"
def CURRENT_DIR='.'
def GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'

pipeline {

    agent any

    environment {
        // Need the staging properties anyway to deploy to staging and production simultaneously when doing a prod release
        ENVIRONMENT_STAGING = 'staging'
    }

    options {
        // Keep maximum 10 archived artifacts
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))

        // No simultaneous builds
        disableConcurrentBuilds()
    }

    /*
    post {
        always {
          discordSend description: 'Jenkins Pipeline Build', footer:  '' , link: env.BUILD_URL, result: currentBuild.currentResult, unstable: false, title: JOB_NAME, webhookURL: 'https://discord.com/api/webhooks/1177227683361472593/6SB7J264CEPqUlXUWvGCxvPt2EhueIYMDOHyocC_r8QSMZfw0QVLcoFdjxxHLbgQVNev'
        }
    }
    */

    stages {
        stage('Prepare workspace') {
            steps {
                echo 'Prepare workspace'

                // Clean workspace
                step([$class: 'WsCleanup'])

                // Checkout git
                checkout scm
            }
        }

        stage('Setup environment') {
            steps {
                echo 'Setup environment'

                script {
                    def fullBranchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'unknown'
                    echo "Actual Branch detected: ${fullBranchName}"

                    // Strip 'origin/' if present
                    def branchName = fullBranchName.replace('origin/', '').trim()
                    echo "Normalized Branch name: ${branchName}"

                    if (branchName.contains('main') || branchName.contains('master')) {
                        GLOBAL_ENVIRONMENT = 'production'
                    } else if (branchName.contains('development')) {
                        GLOBAL_ENVIRONMENT = 'development'
                    } else {
                        GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'
                    }

                    // Get tag on current branch
                    def TAG = sh(returnStdout: true, script: 'git tag --points-at HEAD').trim()

                    echo 'Branch To Build: ' + branchName
                    echo 'Environment Set To: ' + GLOBAL_ENVIRONMENT

                    if (TAG && GLOBAL_ENVIRONMENT == 'staging') {
                        echo 'Build for production requested via tag: ' + TAG

                        // Ask user whether master should be built and deployed to production
                        try {
                            timeout(time: 15, unit: 'MINUTES') {
                                def APPROVED = input(
                                    id: 'BuildForProductionInput',
                                    message: 'Build and deploy',
                                    parameters: [
                                        booleanParam(
                                            defaultValue: false,
                                            description: '',
                                            name: 'Build and deploy ' + TAG + ' for production?'
                                        )
                                    ]
                                )

                                if (APPROVED) {
                                    GLOBAL_ENVIRONMENT = 'production'
                                } else {
                                    error 'Build for production aborted'
                                }
                            }
                        } catch (err) {
                            error 'Build for production aborted'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                dir(CURRENT_DIR) {
                    echo 'Build ' + GLOBAL_ENVIRONMENT

                    script {
                        if (GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                            echo 'This is not develop nor main branch and should not be built'
                        } else {
                            build(GLOBAL_ENVIRONMENT)

                            if (GLOBAL_ENVIRONMENT == 'production') {
                                echo 'Additionally, built staging for production release'
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                dir(CURRENT_DIR) {
                    echo 'Deploy ' + GLOBAL_ENVIRONMENT

                    script {
                        if (GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                            echo 'This is not develop nor main branch and should not be deployed'
                        } else {
                            deploy(GLOBAL_ENVIRONMENT)

                            if (GLOBAL_ENVIRONMENT == 'production') {
                                echo 'Additionally, deployed staging for production release'
                            }
                        }
                    }
                }
            }
        }
    }
}

def build(ENVIRONMENT) {
    echo 'started building image...'
    echo 'Build ENV ' + ENVIRONMENT
    sh 'chmod +x ./jenkins/scripts/docker-build.sh'
    sh './jenkins/scripts/docker-build.sh'
}

def deploy(ENVIRONMENT) {
    echo 'started deploying'
    sshagent(credentials: ['vps-ssh-key']) {
        sh 'chmod +x ./jenkins/scripts/remote-deploy.sh'
        sh './jenkins/scripts/remote-deploy.sh'
    }
}
