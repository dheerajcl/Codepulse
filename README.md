# Codepulse
A real-time code editor


### Environment Variables

Create a `.env` file in the root directory of the project by following the .env.example file:



### Docker Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/dheerajcl/Codepulse.git

2. Navigate to the project directory:

    ```sh
    cd Codepulse

3. Build the Docker image:

    ```sh
    docker build -t Codepulse .

4. Run the Docker container:

    ```sh
    docker run -d -p 5000:5000 --env-file .env Codepulse

5. Access the application at http://localhost:5000






