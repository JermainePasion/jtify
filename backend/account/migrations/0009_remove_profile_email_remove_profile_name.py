# Generated by Django 5.0.1 on 2024-02-09 05:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_alter_profile_email_alter_profile_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='email',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='name',
        ),
    ]
