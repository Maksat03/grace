# Generated by Django 4.2.5 on 2023-09-29 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('request', '0002_alter_request_answered_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='request',
            name='category',
            field=models.CharField(choices=[('services', 'Услуги'), ('store', 'Магазин')], default='services', max_length=255),
        ),
    ]
