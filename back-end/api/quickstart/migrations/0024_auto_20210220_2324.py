# Generated by Django 3.1.5 on 2021-02-20 23:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0023_remove_post_isprivatetofriends'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='_id',
            new_name='id',
        ),
    ]