"""add table for shared documents

Revision ID: fc5427cdfa48
Revises: 1daac830ecf2
Create Date: 2025-01-14 13:48:33.937202

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'fc5427cdfa48'
down_revision = '1daac830ecf2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('shared_document',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('document_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('share_token', sa.String(length=200), nullable=False),
    sa.Column('role', sa.String(length=10), nullable=False),
    sa.Column('expiration', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['document_id'], ['document.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('share_token')
    )
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.drop_index('share_token')
        batch_op.drop_column('share_expiration')
        batch_op.drop_column('share_token')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.add_column(sa.Column('share_token', mysql.VARCHAR(length=200), nullable=True))
        batch_op.add_column(sa.Column('share_expiration', mysql.DATETIME(), nullable=True))
        batch_op.create_index('share_token', ['share_token'], unique=True)

    op.drop_table('shared_document')
    # ### end Alembic commands ###
