# Generated by Django 4.2.4 on 2023-08-22 00:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nospeak_app', '0006_alter_historial_usuario_alter_playlist_usuario_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='artista',
            name='portada',
            field=models.URLField(null=True),
        ),
    ]
