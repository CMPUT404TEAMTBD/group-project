# Generated by Django 3.1.5 on 2021-03-15 01:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0005_auto_20210304_2014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='author',
            field=models.JSONField(),
        ),
    ]
