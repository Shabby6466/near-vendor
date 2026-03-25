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
def CURRENT_DIR='backend'

pipeline {

    agent any

    environment {
        GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'
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
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'unknown'
                    echo "Actual Branch detected: ${branchName}"

                    if (branchName.contains('main') || branchName.contains('master')) {
                        env.GLOBAL_ENVIRONMENT = 'production'
                    } else if (branchName.contains('development')) {
                        env.GLOBAL_ENVIRONMENT = 'development'
                    } else {
                        env.GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'
                    }

                    // Get tag on current branch
                    def TAG = sh(returnStdout: true, script: 'git tag --points-at HEAD').trim()

                    echo 'Branch To Build: ' + branchName
                    echo 'Environment Set To: ' + env.GLOBAL_ENVIRONMENT

                    if (TAG && env.GLOBAL_ENVIRONMENT == 'staging') {
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
                                    env.GLOBAL_ENVIRONMENT = 'production'
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
                    echo 'Build ' + env.GLOBAL_ENVIRONMENT

                    script {
                        if (env.GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                            echo 'This is not develop nor main branch and should not be built'
                        } else {
                            build(env.GLOBAL_ENVIRONMENT)

                            if (env.GLOBAL_ENVIRONMENT == 'production') {
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
                    echo 'Deploy ' + env.GLOBAL_ENVIRONMENT

                    script {
                        if (env.GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                            echo 'This is not develop nor main branch and should not be deployed'
                        } else {
                            deploy(env.GLOBAL_ENVIRONMENT)

                            if (env.GLOBAL_ENVIRONMENT == 'production') {
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
