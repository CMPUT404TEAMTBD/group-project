# Generated by Django 3.1.5 on 2021-03-05 03:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0004_auto_20210226_0339'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-published']},
        ),
    ]