# Generated by Django 3.1.6 on 2021-02-08 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0015_comment_postid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.CharField(max_length=128),
        ),
    ]