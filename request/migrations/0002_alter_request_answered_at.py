# Generated by Django 4.2.5 on 2023-09-27 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('request', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='request',
            name='answered_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]