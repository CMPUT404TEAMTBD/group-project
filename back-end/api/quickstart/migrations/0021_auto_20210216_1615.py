# Generated by Django 3.1.5 on 2021-02-16 23:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0020_inbox'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inbox',
            name='items',
            field=models.JSONField(default=list),
        ),
    ]