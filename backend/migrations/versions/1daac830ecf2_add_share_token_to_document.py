"""add share token to document

Revision ID: 1daac830ecf2
Revises: b6494e0ecf0c
Create Date: 2025-01-14 12:02:03.415105

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1daac830ecf2'
down_revision = 'b6494e0ecf0c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.add_column(sa.Column('share_token', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('share_expiration', sa.DateTime(), nullable=True))
        batch_op.create_unique_constraint(None, ['share_token'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('share_expiration')
        batch_op.drop_column('share_token')

    # ### end Alembic commands ###
