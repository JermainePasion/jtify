# Generated by Django 5.0.1 on 2024-03-21 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0037_subscribers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscribers',
            name='plan_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
