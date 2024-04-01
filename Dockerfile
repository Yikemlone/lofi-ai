# Use the official Python image as the base image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required Python packages
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Print the directory structure
RUN ls -R

# Expose the port that your Flask app listens on
EXPOSE 5000

# Start the Flask app
CMD ["flask", "--app", "server", "run"]