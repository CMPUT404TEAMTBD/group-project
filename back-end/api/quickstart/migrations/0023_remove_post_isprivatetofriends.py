# Generated by Django 3.1.5 on 2021-02-20 20:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0022_auto_20210216_1646'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='isPrivateToFriends',
        ),
    ]