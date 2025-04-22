pipeline{
    agent any
    environment{
        SONAR_HOME = tool 'Sonar'
    }
    stages{
        stage('clone The Repo'){
            steps{
                git branch: 'main' , url: 'https://github.com/omnagare9975/BlogWebWithORM.git'
            }
        }
        stage('SonarQube Code analysis'){
            steps{
                withSonarQubeEnv('Sonar'){
                    sh '$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=blogwebsite -Dsonar.projectKey=blogwebsite'
                }
            }
        }
        stage('OWASAP Dependancy Check'){
            steps{
                dependencyCheck additionalArguments: '--scan ./' , odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Sonar Quality Gate Scan'){
            steps{
                timeout(time:2 , unit: 'MINUTES'){
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage('Trivy Scan'){
            steps{
                sh 'trivy fs --format table -o trivy-fs-remport.html .'
            }
        }
        stage('deploy on the EC2'){
            steps{
                     sh '''
                        docker stop profile || true
                        docker rm profile || true
                        docker build -t blogapp .
                        docker run -d --name profile -p 3000:3000 blogapp 
                   
                     '''

            }
        }
    }
    
}
