FROM python:3

WORKDIR /usr/src/app

COPY ./requirments.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app.py .

CMD [ "python", "./app.py" ]
