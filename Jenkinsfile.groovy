pipeline {
    agent any
    tools { nodejs "good" }
    environment {
        NODE_ENV = "test"
        TOKEN = 'xoxb-658186575794-708542424066-EmOCknZrBs66eK9cTg0a7BhN'
        DUST_API_KEY = 'XtvRvBVCs1VmlZD8KfgO5zLmYV73SGNrvw5HucyJL4ppQPfmCd7cYpnJ7zbQpQioZVrnUySbpC82lsfr8s5gng%3D%3D'
        FORECAST_TOKEN = '677351504163558e6b83764082c12e8d'
        FOOTBALL_KEY = '61b031ab5dmsh20359493ae08a90p19602djsnf5bf002e22d8'
        HOLIDAY_API_KEY = 'lBBRnvK6Ek%2BPnbtG3t1M7FJb13qDfUC8CqW2vcRF6s%2B0cBaeeUxpwOziJ7SzBnpmN6ZBQ5TPcisYZ%2BoM8gXy%2BA%3D%3D'
    }
    stages {
        stage("prepare") {
            steps {
                sh 'ls'
                sh 'pwd'
                sh 'whoami'
            }
        }
        stage('Cloning Git') {
            steps {
                slackSend(color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
                git 'https://github.com/taehyeong224/slack-bot'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
    }
    post {
        success {
            //   sh 'git remote set-url heroku https://git.heroku.com/kth-slack-bot.git'
            //   sh 'git push heroku master'
            slackSend(color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        failure {
            slackSend(color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
    }
}