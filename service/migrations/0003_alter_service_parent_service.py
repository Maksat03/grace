# Generated by Django 4.2.5 on 2023-10-01 15:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0002_alter_service_parent_service'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='parent_service',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sub_services', to='service.service'),
        ),
    ]
